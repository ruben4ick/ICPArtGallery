use ic_cdk::api;
use ic_cdk_macros::{init, query, update, post_upgrade, pre_upgrade};
use std::cell::RefCell;
use std::collections::{HashSet, HashMap};
use candid::{CandidType, Deserialize, Principal};
use ic_certified_map::{AsHashTree, Hash};
use ic_cdk::storage;

mod http;
use http::add_certified_nft;


thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(CandidType, Deserialize, Default)]
struct State {
    nfts: Vec<NFT>,
    custodians: HashSet<Principal>,

    // NFT ID -> Price in cycles (ICP)
    listings: HashMap<u64, u64>, 
}

#[derive(CandidType, Deserialize)]
struct StableState {
    state: State,
    certified: Vec<(String, Hash)>,
}

#[derive(CandidType, Deserialize)]
struct NFT {
    id: u64,
    owner: Principal,
    metadata: Metadata,
}

#[derive(CandidType, Deserialize, Clone)]
struct Metadata {
    name: String,
    description: String,
    image_data: Vec<u8>,
    content_type: String,
}

#[pre_upgrade]
fn pre_upgrade() {
    let state = STATE.with(|s| s.replace(State::default()));
    let certified = http::CERTIFIED.with(|c| {
        c.borrow().iter().map(|(k, v)| (k.clone(), *v)).collect()
    });

    let stable = StableState { state, certified };
    storage::stable_save((stable,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    if let Ok((StableState { state, certified },)) = storage::stable_restore() {
        STATE.with(|s| s.replace(state));
        http::CERTIFIED.with(|c| {
            let mut tree = c.borrow_mut();
            *tree = ic_certified_map::RbTree::from_iter(certified);
            let root = ic_certified_map::labeled_hash(b"http_assets", &tree.root_hash());
            api::set_certified_data(&root);
        });
    } else {
        ic_cdk::println!("Failed to restore stable state. State was reset.");
    }
}

#[init]
fn init() {
    STATE.with(|s| {
        let caller = api::caller();
        s.borrow_mut().custodians.insert(caller);
    });
}

// MARK: basic work with NFT
#[update]
fn mint_nft(name: String, description: String, image_data: Vec<u8>, content_type: String) -> u64 {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let id = state.nfts.len() as u64;
        let metadata = Metadata { name, description, image_data: image_data.clone(), content_type };
        let nft = NFT { id, owner: caller, metadata };
        state.nfts.push(nft);
        add_certified_nft(id, &image_data);
        id
    })
}


#[query]
fn get_nfts(owner: Principal) -> Vec<Metadata> {
    STATE.with(|s| {
        s.borrow().nfts.iter()
            .filter(|n| n.owner == owner)
            .map(|n| n.metadata.clone())
            .collect()
    })
}

#[query]
fn get_nft(id: u64) -> Option<Metadata> {
    STATE.with(|s| {
        s.borrow().nfts.get(id as usize).map(|n| n.metadata.clone())
    })
}

#[update]
fn transfer_nft(id: u64, to: Principal) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(nft) = state.nfts.get_mut(id as usize) {
            if nft.owner == caller {
                nft.owner = to;
            }
        }
    });
}

// MARK: Marketplave functionality
#[update]
fn list_nft(id: u64, price: u64) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(nft) = state.nfts.get(id as usize) {
            if nft.owner == caller {
                state.listings.insert(id, price);
            }
        }
    });
}

#[update]
fn buy_nft(id: u64) {
    let buyer = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(&price) = state.listings.get(&id) {
            if let Some(nft) = state.nfts.get_mut(id as usize) {
                if nft.owner != buyer {
                    let cycles_balance = api::canister_balance();
                    if cycles_balance > price {
                        transfer_nft(id, buyer);
                        state.listings.remove(&id);
                    }
                }
            }
        }
    });
}

#[update]
fn cancel_listing(id: u64) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(nft) = state.nfts.get(id as usize) {
            if nft.owner == caller {
                state.listings.remove(&id);
            }
        }
    });
}

#[query]
fn get_listings() -> Vec<(u64, u64)> {
    STATE.with(|s| {
        s.borrow().listings.iter().map(|(id, price)| (*id, *price)).collect()
    })
}

#[update]
fn burn_nft(id: u64) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(nft) = state.nfts.get(id as usize) {
            if nft.owner == caller {
                state.nfts.remove(id as usize);
            }
        }
    });
}

#[update]
fn update_nft_metadata(id: u64, name: Option<String>, description: Option<String>, image_data: Option<Vec<u8>>, content_type: Option<String>) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        if let Some(nft) = state.nfts.get_mut(id as usize) {
            if nft.owner == caller {
                if let Some(name) = name {
                    nft.metadata.name = name;
                }
                if let Some(description) = description {
                    nft.metadata.description = description;
                }
                if let Some(image_data) = image_data {
                    nft.metadata.image_data = image_data.clone();
                    add_certified_nft(id, &image_data);
                }
                if let Some(content_type) = content_type {
                    nft.metadata.content_type = content_type;
                }
            }
        }
    });
}

#[update]
fn mint_many_nfts(names: Vec<String>, descriptions: Vec<String>, images: Vec<Vec<u8>>, content_types: Vec<String>) -> Vec<u64> {
    let caller = api::caller();
    let mut nft_ids = Vec::new();

    for ((name, description), (image_data, content_type)) in names.iter().zip(descriptions.iter()).zip(images.iter().zip(content_types.iter())) {
        let id = mint_nft(name.clone(), description.clone(), image_data.clone(), content_type.clone());
        nft_ids.push(id);
    }

    nft_ids
}

#[update]
fn get_user_balance_cycles() -> u64 {

    let caller = api::caller(); 
    
    let cycles_balance = api::canister_balance();
    
    cycles_balance
}


fn cycles_to_icp(cycles: u64) -> f64 {
    // 1 ICP = 1,000,000,000 cycles
    let icp_per_cycle = 1_000_000_000u64; 

    cycles as f64 / icp_per_cycle as f64
}

#[update]
fn get_user_balance_ICP() -> f64 {
    
    let cycles_balance = get_user_balance_cycles();
    
    let icp_balance = cycles_to_icp(cycles_balance);
    
    icp_balance
}