/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { ImgHTMLAttributes } from 'react';

export default function ImageFallback(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  const [src, setSrc] = React.useState(
    props.src || '/assets/images/notfound.png',
  );

  return (
    <img
      {...props}
      src={src}
      onError={() => setSrc('/images/default-bg.jpg')}
    />
  );
}
