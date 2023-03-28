import React, { useState, MouseEvent } from "react";
import { IFolderNode, IFileNode } from "../../types/Files";

// MUI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

import { SvgIconProps } from "@mui/material/SvgIcon";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  fileType: string;
  filePath: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  // [`& .${treeItemClasses.content}`]: {
  //   color: theme.palette.text.secondary,
  //   paddingRight: theme.spacing(1),
  //   fontWeight: theme.typography.fontWeightMedium,
  //   "&.Mui-expanded": {
  //     fontWeight: theme.typography.fontWeightRegular,
  //   },
  //   "&:hover": {
  //     backgroundColor: theme.palette.action.hover,
  //   },
  //   "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
  //     backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
  //     color: "var(--tree-view-color)",
  //   },
  //   [`& .${treeItemClasses.label}`]: {
  //     fontWeight: "inherit",
  //     color: "inherit",
  //   },
  // },
  // [`& .${treeItemClasses.group}`]: {
  //   [`& .${treeItemClasses.content}`]: {
  //     paddingLeft: theme.spacing(2),
  //   },
  // },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const { bgColor, color, labelIcon: LabelIcon, labelInfo, labelText, fileType, filePath, ...other } = props;
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleMouseEnter = (event: MouseEvent) => {
    console.log(filePath);
    setIsHover(true);
  };

  const handleMouseOut = (event: MouseEvent) => {
    setIsHover(false);
  };

  const onClickHandler = (event: MouseEvent) => {
    console.log(event.currentTarget.getAttribute("data-test"));
    const parentNode = event.currentTarget;
    // if (parentNode instanceof Element) {
    //   console.log(parentNode.getAttribute());
    // }
    event.stopPropagation();
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: "inherit", fontSize: 13, flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
          {isHover && fileType === "file" ? (
            <Box data-type={fileType} data-path={filePath}>
              <Box onClick={onClickHandler} component={NoteAddOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
              <Box onClick={onClickHandler} component={CreateNewFolderOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : isHover && fileType === "folder" ? (
            <Box data-type={fileType} data-path={filePath}>
              <Box onClick={onClickHandler} component={CreateNewFolderOutlinedIcon} color="inherit" sx={{ mr: 1, fontSize: 16 }} />
            </Box>
          ) : (
            <React.Fragment />
          )}
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

interface FileBrowserProps {
  data: IFileNode | IFolderNode;
}

export default function FileBrowser({ data }: FileBrowserProps) {
  let nodeIdCounter = 0;
  const renderTree = (treeData: IFileNode | IFolderNode) => {
    const nodeId = nodeIdCounter++;
    if (treeData.type === "file") {
      return <StyledTreeItem nodeId={nodeId.toString()} labelText={treeData.name} fileType={treeData.type} filePath={treeData.path} labelIcon={DescriptionOutlinedIcon} bgColor="#e8f0fe" />;
    } else {
      return (
        <StyledTreeItem nodeId={nodeId.toString()} labelText={treeData.type === "root" ? "FILES" : treeData.name} fileType={treeData.type} filePath={treeData.path} labelIcon={treeData.type === "root" ? null : FolderIcon} bgColor="#e8f0fe">
          {treeData.children
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort the children alphabetically
            .map((child) => (
              <React.Fragment key={child.name}>{renderTree(child)}</React.Fragment>
            ))}
        </StyledTreeItem>
      );
    }
  };

  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 275, overflowY: "auto" }}
    >
      {renderTree(data)}
    </TreeView>
  );

  // return (
  //   <TreeView
  //     aria-label="gmail"
  //     defaultExpanded={["3"]}
  //     defaultCollapseIcon={<ExpandMoreIcon />}
  //     defaultExpandIcon={<ChevronRightIcon />}
  //     defaultEndIcon={<div style={{ width: 24 }} />}
  //     sx={{ height: 264, flexGrow: 1, maxWidth: 275, overflowY: "auto" }}
  //   >
  //     <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} bgColor="#e8f0fe" />
  //     <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} bgColor="#e8f0fe" />
  //     <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={SaveIcon} bgColor="#e8f0fe">
  //       <StyledTreeItem nodeId="5" labelText="Social" labelIcon={SupervisorAccountIcon} color="#1a73e8" bgColor="#e8f0fe" />
  //       <StyledTreeItem nodeId="6" labelText="Updates" labelIcon={InfoIcon} color="#e3742f" bgColor="#fcefe3" />
  //       <StyledTreeItem nodeId="7" labelText="Forums" labelIcon={ForumIcon} color="#a250f5" bgColor="#f3e8fd" />
  //       <StyledTreeItem nodeId="8" labelText="Promotions" labelIcon={LocalOfferIcon} color="#3c8039" bgColor="#e6f4ea" />
  //     </StyledTreeItem>
  //     <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
  //   </TreeView>
  // );
}

// const FolderTree: React.FC<Props> = ({ data }) => {
//   const renderTree = (treeData: FileOrFolder) => {
//     if (treeData.type === "file") {
//       return <li>{treeData.name}</li>;
//     } else {
//       return (
//         <li>
//           {treeData.name}
//           <ul>
//             {treeData.children
//               .sort((a, b) => a.name.localeCompare(b.name)) // Sort the children alphabetically
//               .map((child) => (
//                 <React.Fragment key={child.name}>{renderTree(child)}</React.Fragment>
//               ))}
//           </ul>
//         </li>
//       );
//     }
//   };

//   return <ul>{renderTree(data)}</ul>;
// };
