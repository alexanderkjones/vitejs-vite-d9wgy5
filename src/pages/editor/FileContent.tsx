import { IFile } from "../../types/Files";
import { useFiles } from "../../contexts/FilesContext";

interface FileContentProps {}
export default function FileContent() {
  const { selectedFile } = useFiles();
  const fileType = selectedFile.name.split(".").pop();

  // useEffect(() => {
  //   const handleSave = (event: KeyboardEvent) => {
  //     if (event.metaKey && event.key === 's') {
  //       event.preventDefault(); // prevent default browser behavior
  //       // call your save function here
  //     }
  //   };
  //   window.addEventListener('keydown', handleSave);
  //   return () => {
  //     window.removeEventListener('keydown', handleSave);
  //   };
  // }, []); // run this effect only once when the component mounts

  // return(
  //   {fileType === ""}
  // )

  // const handleKeyDown = (key: string) => {
  //   if (key === "Escape") {
  //     setIsRenaming(false);
  //     setName(item.name);
  //     return;
  //   }
  //   if (key === "Enter" && item.type === "folder") {
  //     renameFolder(item, name);
  //     setIsRenaming(false);
  //     return;
  //   }
  //   if (key === "Enter" && item.type === "file") {
  //     renameFile(item, name);
  //     setIsRenaming(false);
  //     return;
  //   }
  // };
}
