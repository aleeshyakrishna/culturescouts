import PhotoBanner from "@/components/PhotoBanner";
import { photo } from "@/lib/photos";

export default function ScoutLayout({ children }) {
  return (
    <>
      <div className="narrow banner-wrap">
        <PhotoBanner photo={photo("crown")} eyebrow="Be a Culture Scout" title="Snap a festival poster" position="right 30%">
          <p>Photograph a Theyyam or temple festival poster. Gemma reads the Malayalam, you check it, and it goes on the map for the world to find.</p>
        </PhotoBanner>
      </div>
      {children}
    </>
  );
}
