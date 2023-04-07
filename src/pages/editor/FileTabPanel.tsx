import { useState, useEffect, MouseEventHandler } from "react";
import { useFiles } from "../../contexts/FilesContext";
import { IFile } from "../../types/Files";

// MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// Icons
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Typography from "@mui/material/Typography";

interface FileTabPanelProps {}

export default function FileTabPanel({}: FileTabPanelProps) {
  const { openFiles, selectedFile, handleFileOpen, handleFileClose } = useFiles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (openFiles.length) {
      setValue(openFiles.length - 1);
    }
  }, [openFiles]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("tabChanged:", newValue);
    setValue(newValue);
  };

  const renderOpenTabs = (files: IFile[]) => {
    return files.map((file, index) => <FileTab value={index} key={file.path} item={file} />);
  };

  return (
    <Box>
      <Tabs sx={{ minHeight: "0px" }} variant="scrollable" scrollButtons="auto" TabIndicatorProps={{ sx: { display: "none" } }} value={value} onChange={handleChange}>
        {renderOpenTabs(openFiles)}
      </Tabs>
    </Box>
  );
}

interface FileTabProps {
  value: number;
  item: IFile;
}

function FileTab({ value, item }: FileTabProps) {
  const { selectedFile, handleFileOpen, handleFileClose } = useFiles();
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const fileModifiedIcon = CircleIcon;
  const fileCloseIcon = CloseIcon;
  const fileIcon = TextSnippetIcon;

  const selected = selectedFile == item;
  const textColor = selected ? "#FFFFFF" : "#e0e0e0";
  const backgroundColor = selected ? "#14181F" : "#616161";

  const tabRootSx = {
    textTransform: "none",
    color: textColor,
    padding: 0,
    pr: 1,
    pl: 1,
    minHeight: "0px",
    backgroundColor: backgroundColor,
    opacity: 1,
    fontFamily: "Monaco, monospace",
  };

  const handleClose: MouseEventHandler<SVGSVGElement> = (event) => {
    event.stopPropagation();
    handleFileClose(item);
  };

  const handleOpen: MouseEventHandler<HTMLDivElement> = (event) => {
    handleFileOpen(item);
  };

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(true);
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = (event) => {
    setIsHover(false);
  };

  return (
    <Tab
      value={value}
      onClick={handleOpen}
      sx={{ "&.MuiTab-root": tabRootSx }}
      label={
        <Box component="div" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
          <Box component={fileIcon} color="inherit" sx={{ fontSize: 13, mr: 0.4 }} />
          <Typography sx={{ fontSize: 15 }}>{item.name}</Typography>
          <Box>
            {isModified && !isHover && <Box component={fileModifiedIcon} color="inherit" sx={{ fontSize: 10, ml: 0.5, mt: 0.5, minWidth: 14 }} />}
            {isHover && <Box onClick={handleClose} component={fileCloseIcon} color="inherit" sx={{ fontSize: 14, ml: 0.5, mt: 0.5 }} />}
            {!isModified && !isHover && <Box component={fileCloseIcon} color="inherit" sx={{ fontSize: 14, ml: 0.5, mt: 0.5, opacity: 0 }} />}
          </Box>
        </Box>
      }
    />
  );
}
