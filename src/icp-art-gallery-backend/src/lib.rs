use ic_cdk::api;
use ic_cdk_macros::{init, query, update, post_upgrade, pre_upgrade};
use std::cell::RefCell;
use std::collections::{HashSet, HashMap};
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
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
    created_at: u64,
    likes: u64,
    dislikes: u64,
}

#[derive(CandidType, Deserialize, Clone)]
struct Metadata {
    name: String,
    description: Option<String>,
    image_data: Vec<u8>,
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

#[derive(CandidType, Deserialize)]
struct NFTView {
    id: u64,
    owner: Principal,
    metadata: Metadata,
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
fn mint_nft(name: String, description: String, image_data: Vec<u8>, price: u64) -> u64 {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let id = state.nfts.len() as u64;
        let metadata = Metadata {
            name,
            description,
            image_data: image_data.clone()
        };
        let created_at = time();
        let nft = NFT {
            id,
            owner: caller,
            metadata,
            created_at,
            likes: 0,
            dislikes: 0,
        };
        state.nfts.push(nft);
        state.listings.insert(id, price);
        add_certified_nft(id, &image_data);
        id
    })
}

#[query]
fn get_nft(id: u64) -> Option<Metadata> {
    STATE.with(|s| {
        s.borrow().nfts.get(id as usize).map(|n| n.metadata.clone())
    })
}

#[query]
fn get_all_nfts() -> Vec<NFTView> {
    STATE.with(|s| {
        s.borrow().nfts.iter()
            .map(|n| NFTView {
                id: n.id,
                owner: n.owner,
                metadata: n.metadata.clone(),
            })
            .collect()
    })
}

#[query]
fn get_user_nfts(owner: Principal) -> Vec<Metadata> {
    STATE.with(|s| {
        s.borrow().nfts.iter()
            .filter(|n| n.owner == owner)
            .map(|n| n.metadata.clone())
            .collect()
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
fn update_nft_metadata(id: u64, name: Option<String>, description: Option<String>, image_data: Option<Vec<u8>>) {
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
            }
        }
    });
}

#[update]
fn like_nft(id: u64) {
    STATE.with(|s| {
        if let Some(nft) = s.borrow_mut().nfts.get_mut(id as usize) {
            nft.likes += 1;
        }
    });
}

#[update]
fn dislike_nft(id: u64) {
    STATE.with(|s| {
        if let Some(nft) = s.borrow_mut().nfts.get_mut(id as usize) {
            nft.dislikes += 1;
        }
    });
}