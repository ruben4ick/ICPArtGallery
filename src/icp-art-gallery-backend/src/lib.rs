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
    liked_by: HashMap<u64, HashSet<Principal>>,
    disliked_by: HashMap<u64, HashSet<Principal>>,
}

#[derive(CandidType, Deserialize)]
struct StableState {
    state: State,
    certified: Vec<(String, Hash)>,
}

#[derive(CandidType, Deserialize, Clone)]
struct NFT {
    id: u64,
    owner: Principal,
    created_at: u64,
    likes: u64,
    dislikes: u64,
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

#[update]
fn mint_nft(name: String, description: String, image_data: Vec<u8>, content_type: String) -> u64 {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        let id = state.nfts.len() as u64;
        let metadata = Metadata {
            name,
            description,
            image_data: image_data.clone(),
            content_type,
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
fn get_all_nfts() -> Vec<NFT> {
    STATE.with(|s| {
        s.borrow().nfts.clone()
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
fn update_nft_metadata(
    id: u64,
    name: Option<String>,
    description: Option<String>,
    image_data: Option<Vec<u8>>,
    content_type: Option<String>,
) {
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
fn like_nft(id: u64) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();

        if let Some(set) = state.liked_by.get(&id) {
            if set.contains(&caller) {
                return;
            }
        }

        if let Some(dislike_set) = state.disliked_by.get_mut(&id) {
            dislike_set.remove(&caller);
            if let Some(nft) = state.nfts.get_mut(id as usize) {
                if nft.dislikes > 0 {
                    nft.dislikes -= 1;
                }
            }
        }

        state.liked_by.entry(id).or_default().insert(caller);
        if let Some(nft) = state.nfts.get_mut(id as usize) {
            nft.likes += 1;
        }
    });
}

#[update]
fn dislike_nft(id: u64) {
    let caller = api::caller();
    STATE.with(|s| {
        let mut state = s.borrow_mut();

        if let Some(set) = state.disliked_by.get(&id) {
            if set.contains(&caller) {
                return;
            }
        }

        if let Some(like_set) = state.liked_by.get_mut(&id) {
            like_set.remove(&caller);
            if let Some(nft) = state.nfts.get_mut(id as usize) {
                if nft.likes > 0 {
                    nft.likes -= 1;
                }
            }
        }

        state.disliked_by.entry(id).or_default().insert(caller);
        if let Some(nft) = state.nfts.get_mut(id as usize) {
            nft.dislikes += 1;
        }
    });
}
