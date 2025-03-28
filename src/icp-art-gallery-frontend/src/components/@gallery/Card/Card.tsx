import '../../../index.scss';
import './style.scss';
import CardProps from "../interfaces/card-props";
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import React from "react";

// TODO: hook for like
// TODO: hook for dislike
// TODO: hook for details

export const Card: React.FC<{children: CardProps }> = ({children}) => {
  return (
      <div className="glass w-[380px] rounded-lg overflow-hidden flex flex-col">
          <img
              alt="card img"
              className="mt-[4%] mx-[4%] w-[92%] h-auto object-cover rounded-lg"
              src={children.imageLink}
          />
          <div className="title pl-[3%] mt-[10px]">
              {children.name
                  ? <span>{children.name}</span>
                  : <span>.untitled</span>
              }
          </div>
          {/*TODO: add hooks for likes and dislikes*/}
          <div className="flex items-center justify-between gap-4 mt-[8px]">
              <button type="button" className="card-button mx-[4%]">
                  <ThumbsUp size={20}/>
              </button>
              <span className="like-percent">
                  {children.likePercentage !== null ? `${children.likePercentage}%` : '_null'}
              </span>
              <button type="button" className="card-button mx-[4%]">
                  <ThumbsDown size={20}/>
              </button>
          </div>
          {/*TODO: add hook for details*/}
          <button className="card-button mt-[16px] mb-[4%] mx-[4%]" type="button">
              .details
          </button>
      </div>
  );
};

export default Card;
