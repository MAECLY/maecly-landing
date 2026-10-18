import Image from "next/image";

/**
 * A product icon in its squircle, with a hairline ring so dark icons keep an
 * edge on the dark theme. The ring is an overlay because an inset shadow on
 * an <img> paints under the image.
 */
export function ProductIcon({
  src,
  alt = "",
  size,
  className = "",
  sizes,
}: {
  src: string;
  alt?: string;
  /** Intrinsic size in CSS px (also the rendered size unless `className` overrides it). */
  size: number;
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`icon-squircle relative inline-block shrink-0 overflow-hidden rounded-[22%] ${className}`} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={sizes ?? `${size}px`}
        unoptimized={src.endsWith(".svg")}
        className="block size-full object-cover"
      />
      <span className="icon-ring pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
    </span>
  );
}
