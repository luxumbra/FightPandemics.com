import React from "react";
import HeartIcon from "../Icon/heart";
import CommentIcon from "../Icon/comment";
import ShareIcon from "../Icon/share";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default ({ url, numLikes, numComments, numShares, onCopy }) => {
  return (
    <div className="social-icons">
      <div className="social-icon">
        <HeartIcon className="social-icon-svg" />
        <span>{numLikes}</span>
      </div>
      <div className="social-icon">
        <CommentIcon className="social-icon-svg" />
        <span>{numComments}</span>
      </div>
      <div className="social-icon">
        <CopyToClipboard text={url} onCopy={onCopy}>
          <span>
            <ShareIcon className="social-icon-svg" />
            <span>{numShares}</span>
          </span>
        </CopyToClipboard>
      </div>
    </div>
  );
};
