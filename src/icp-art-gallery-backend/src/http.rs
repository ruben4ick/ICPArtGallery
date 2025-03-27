use std::{borrow::Cow, collections::HashMap, cell::RefCell};
use ic_cdk::api;
use ic_cdk_macros::query;
use candid::CandidType;
use serde::Deserialize;
use ic_certified_map::{RbTree, AsHashTree, Hash, labeled_hash};
use sha2::{Sha256, Digest};
use serde_cbor::Serializer;
use serde::Serialize;

#[derive(CandidType)]
pub struct HttpResponse<'a> {
    pub status_code: u16,
    pub headers: HashMap<&'a str, Cow<'a, str>>,
    pub body: Cow<'a, [u8]>,
}

#[derive(CandidType, Deserialize)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: HashMap<String, String>,
    pub body: Vec<u8>,
}

thread_local! {
    pub static CERTIFIED: RefCell<RbTree<String, Hash>> = RefCell::new(RbTree::new());
}

pub fn add_certified_nft(id: u64, image_data: &[u8]) {
    CERTIFIED.with(|certified| {
        let mut tree = certified.borrow_mut();
        let path = format!("/{}", id);
        let hash = Sha256::digest(image_data);
        tree.insert(path.clone(), hash.into());

        let root_hash = labeled_hash(b"http_assets", &tree.root_hash());
        api::set_certified_data(&root_hash);
    });
}

fn witness(path: &str) -> String {
    CERTIFIED.with(|certified| {
        let tree = certified.borrow();
        let witness = tree.witness(path.as_bytes());
        let tree = ic_certified_map::labeled(b"http_assets", witness);

        let mut buf = vec![];
        let mut serializer = Serializer::new(&mut buf);
        serializer.self_describe().unwrap();
        tree.serialize(&mut serializer).unwrap();

        base64::encode(&buf)
    })
}

#[query]
fn http_request(req: HttpRequest) -> HttpResponse<'static> {
    let path = req.url
        .split('?')
        .next()
        .unwrap_or("/")
        .trim_start_matches('/');
    let nft_id: Option<u64> = path.parse().ok();

    let (status_code, body, content_type) = if let Some(id) = nft_id {
        crate::STATE.with(|s| {
            let state = s.borrow();
            if let Some(nft) = state.nfts.get(id as usize) {
                (200, nft.metadata.image_data.clone(), nft.metadata.content_type.clone())
            } else {
                (404, b"NFT not found".to_vec(), "text/plain".to_string())
            }
        })
    } else {
        (400, b"Bad request".to_vec(), "text/plain".to_string())
    };

    let mut headers = HashMap::new();
    headers.insert("Content-Type", Cow::Owned(content_type));

    if let Some(id) = nft_id {
        if let Some(cert) = api::data_certificate() {
            headers.insert(
                "IC-Certificate",
                Cow::Owned(format!(
                    "certificate=:{}:, tree=:{}:",
                    base64::encode(cert),
                    witness(&format!("/{}", id))
                )),
            );
        }
    }

    HttpResponse {
        status_code,
        headers,
        body: Cow::Owned(body),
    }
}
