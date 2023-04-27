import { IFile } from "../../types/Files";
import { useFiles } from "../../contexts/FilesContext";
import { useState } from "react";

interface FileContentProps {
}
export default function FileContent() {
  const { selectedFile } = useFiles();
  const fileType = selectedFile.name.split(".").pop();
  
}

interface BabylonFileContentProps {
}
function BabylonFileContent(){
  const { selectedFile } = useFiles();

}
