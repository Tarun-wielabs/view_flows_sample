import dynamic from "next/dynamic";

const CreativeEditorSDKWithNoSSR = dynamic(
  () => import("./components/CreativeEditor"),
  {
    ssr: false,
  }
);

export default function Home() {
  return <CreativeEditorSDKWithNoSSR />;
}
