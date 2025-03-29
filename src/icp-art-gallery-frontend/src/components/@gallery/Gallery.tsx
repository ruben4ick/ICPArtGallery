import Card from './Card/Card';
import Masonry from 'react-masonry-css';
import './style.scss';
import { useNfts } from '../../context/@nfts/NftProvider';


const breakpointColumnsObj = {
  default: 5,
  1920: 4,
  1280: 3,
  1024: 2,
  640: 1
};

export const Gallery = () => {
  const { cards, loading, error } = useNfts();

  return (
    <div className="justify-center px-4 w-full ml-[2%] mr-[2%]">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && cards && (
        <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid" columnClassName="masonry-column">
          {cards.map((card, index) => (
            <Card key={index}>{card}</Card>
          ))}
        </Masonry>
      )}
    </div>
  );
};
export default Gallery;
