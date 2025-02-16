import React from "react";
import Summarizer from "@/components/summarizer";
import Header from "@/components/Header";

const Page = () => {
  return (
    <div>
      <Header />
      <div>
        <Summarizer
          title="Sample Title"
          description="Sample Description"
          imageUrl="https://example.com/image.jpg"
          documentUrl="https://example.com/document.pdf"
          category="Sample Category"
        />
      </div>
    </div>
  );
};

export default Page;
