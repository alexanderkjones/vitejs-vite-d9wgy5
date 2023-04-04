import { useState } from "react";
import { useFiles } from "../../contexts/FilesContext";
import { IFile, IFolder } from "../../types/Files";

// MUI
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />)({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  // fontWeight: theme.typography.fontWeightRegular,
  // fontSize: theme.typography.pxToRem(15),
  // marginRight: theme.spacing(1),
  // color: "rgba(255, 255, 255, 0.7)",
  // "&.Mui-selected": {
  //   color: "#fff",
  // },
  // "&.Mui-focusVisible": {
  //   backgroundColor: "rgba(100, 95, 228, 0.32)",
  // },
}));

interface FileTabPanelProps {}

export default function FileTabPanel({}: FileTabPanelProps) {
  const { openFiles, selectedFile, handleFileOpen, handleFileClose } = useFiles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderOpenTabs = (files: IFile[]) => {
    return files.map((file) => <StyledTab label={file.name} />);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <StyledTabs value={value} onChange={handleChange}>
        {renderOpenTabs(openFiles)}
      </StyledTabs>
    </Box>
  );
}
