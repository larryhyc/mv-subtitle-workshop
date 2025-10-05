'use client';

import { FileUpload } from '@/components/FileUpload';
import { VideoEditor } from '@/components/VideoEditor';

const Page = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      <FileUpload />
      <VideoEditor />
    </div>
  );
};

export default Page;
