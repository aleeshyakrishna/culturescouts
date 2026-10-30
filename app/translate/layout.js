import PhotoBanner from "@/components/PhotoBanner";
import { photo } from "@/lib/photos";

export default function TranslateLayout({ children }) {
  return (
    <>
      <div className="narrow banner-wrap">
        <PhotoBanner photo={photo("face")} eyebrow="For visitors" title="Read a festival poster" position="right 25%">
          <p>Found a Malayalam poster for a Theyyam or temple festival? Take a photo and Gemma 4 will explain it in your language: what it is, when to go and how to behave.</p>
        </PhotoBanner>
      </div>
      {children}
    </>
  );
}
