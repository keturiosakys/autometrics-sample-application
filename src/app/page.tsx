import ImageAnalyzer from "./components/ImageAnalyzer";

export default function Home() {
  console.log("I'MPAGE");
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 space-y-10">
      <h1 className="font-bold text-2xl">Image Analyzer</h1>
      <ImageAnalyzer />
    </main>
  );
}
