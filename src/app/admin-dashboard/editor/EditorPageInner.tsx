import { Suspense } from "react";
import EditorPageInner from "./EditorPageInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorPageInner />
    </Suspense>
  );
}
