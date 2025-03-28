import Masonry from 'react-masonry-css';
import '../../index.scss';
import './style.scss';
import CardProps from './interfaces/card-props';
import Card from './Card/Card';

//TODO: fetch data properly
const images = [
  'https://i.pinimg.com/736x/13/88/f4/1388f4fdd2b96a8aa6a7891fae2d92f6.jpg',
  'https://i.etsystatic.com/22054722/r/il/e74cc4/5977089272/il_570xN.5977089272_tmdl.jpg',
  'https://i.pinimg.com/736x/01/76/b7/0176b79f2a499b6cee63de3a590c8609.jpg'
];
const mockCards: CardProps[] = Array.from({ length: 12 }).map((_, i) => ({
  name: `.сard ${i + 1}`,
  like_percentage: Math.floor(Math.random() * 100),
  imageLink: images[i % images.length]
}));

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  1024: 2,
  640: 1
};

export const Gallery = () => {
  return (
    <div className="px-4">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {mockCards.map((card, index) => (
          <Card key={index}>{card}</Card>
        ))}
      </Masonry>
    </div>
  );
};

export default Gallery;
