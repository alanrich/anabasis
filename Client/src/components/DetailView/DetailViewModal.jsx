import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropTypes from "prop-types";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import TabPanelContent from "./TabPanelContent";
import { useTheme } from "@mui/material/styles";
import "react-tabs/style/react-tabs.css";
import ArtistImage from "./ArtistImage";

const DetailViewModal = ({
  isModalOpen,
  handleModalClose,
  tabConfigs,
  modalTabValue,
  handleModalTabChange,
  object,
  imageUrl,
  imageLoading,
  imageError,
  wikiPageContentData,
  wikiCollectionSection,
  artistNames,
}) => {
  const theme = useTheme();

  const tabStyles = {
    tabList: {
      display: "flex",
      backgroundColor: theme.palette.primary.main,
      height: "36px",
      margin: 0,
      padding: 0,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      alignItems: "center",
    },
    tab: {
      flex: 1,
      height: "100%",
      padding: "0 16px",
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: "bold",
      fontSize: ".8125rem",
      border: "none",
      outline: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    selectedTab: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      fontWeight: "bold",
      fontSize: ".8125rem",
    },
  };

  // Remove the Photo tab from tabConfigs
  const filteredTabConfigs = tabConfigs.filter((tab) => tab.label !== "Photo");

  const objectName =
    object?.name ||
    object?.rawData?.nom ||
    object?.rawData?.nom_du_jardin ||
    object?.rawData?.nom_du_festival;

  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="detail-view-modal"
      aria-describedby="expanded-detail-view"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          bgcolor: theme.palette.common.white,
          boxShadow: 24,
          borderRadius: theme.shape.borderRadius,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button in the top right corner */}
        <IconButton
          aria-label="close modal"
          onClick={handleModalClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: theme.palette.common.black,
          }}
        >
          <FullscreenExitIcon fontSize="small" />
        </IconButton>

        {/* Tab Section */}
        <Tabs
          selectedIndex={modalTabValue}
          onSelect={(index) => handleModalTabChange(null, index)}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          forceRenderTabPanel
        >
          <TabList
            style={{
              ...tabStyles.tabList,
              padding: "0",
              margin: "0",
              height: "36px",
              display: "flex",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main,
              borderBottom: "none",
            }}
          >
            {filteredTabConfigs.map((tab, index) => (
              <Tab
                key={index}
                style={{
                  ...tabStyles.tab,
                  ...(modalTabValue === index ? tabStyles.selectedTab : {}),
                  padding: "0",
                  margin: "0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  position: "static",
                  bottom: "auto",
                }}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>

          {filteredTabConfigs.map((tab, index) => (
            <TabPanel
              key={index}
              style={{
                flex: 1,
                overflow: "hidden",
                padding: theme.spacing(2),
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  height: "100%",
                }}
              >
                {/* Left Panel */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    marginRight: { xs: 0, sm: theme.spacing(4) },
                    marginTop: {
                      xs: theme.spacing(2),
                      sm: theme.spacing(0),
                      md: theme.spacing(2),
                      lg: theme.spacing(2),
                    },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <TabPanelContent
                    fields={tab.fields}
                    isModal={true}
                    fontSize={theme.typography.body1.fontSize}
                  />
                </Box>

                {/* Right Panel */}
                {tab.label !== "Œuvres" && (
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "50%" },
                      marginTop: {
                        xs: theme.spacing(2),
                        sm: theme.spacing(0),
                        md: theme.spacing(2),
                        lg: theme.spacing(2),
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      overflowY: "auto",
                      gap: theme.spacing(1),
                    }}
                  >
                    {/* Image */}
                    {imageLoading && <Typography>Loading image...</Typography>}
                    {imageError && <Typography>Error: {imageError}</Typography>}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={`${objectName} Image`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <Typography>{objectName}</Typography>

                    {/* Wikipedia Content */}
                    {wikiPageContentData && wikiPageContentData.content && (
                      <Box
                        sx={{
                          width: "100%",
                          padding: theme.spacing(2),
                        }}
                      >
                        <Typography variant="h6">Wikipedia</Typography>
                        <TabPanelContent
                          fields={[
                            {
                              title: "",
                              value: wikiPageContentData.content,
                              isWikiContent: true,
                            },
                          ]}
                          fontSize={theme.typography.body1.fontSize}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {/* For Œuvres tab, show artist images */}
                {tab.label === "Œuvres" && (
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "50%" },
                      marginTop: {
                        xs: theme.spacing(2),
                        sm: theme.spacing(0),
                        md: theme.spacing(2),
                        lg: theme.spacing(2),
                      },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      overflowY: "auto",
                      flexWrap: "wrap",
                    }}
                  >
                    {artistNames && artistNames.length > 0 ? (
                      artistNames.map((artistName) => (
                        <ArtistImage key={artistName} artistName={artistName} />
                      ))
                    ) : (
                      <Typography
                        variant="subtitle1"
                        sx={theme.typography.subtitle1}
                      >
                        {objectName}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </TabPanel>
          ))}
        </Tabs>
      </Box>
    </Modal>
  );
};

DetailViewModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  tabConfigs: PropTypes.array.isRequired,
  modalTabValue: PropTypes.number.isRequired,
  handleModalTabChange: PropTypes.func.isRequired,
  object: PropTypes.object.isRequired,
  imageUrl: PropTypes.string,
  imageLoading: PropTypes.bool,
  imageError: PropTypes.string,
  wikiPageContentData: PropTypes.object,
  wikiCollectionSection: PropTypes.string,
  artistNames: PropTypes.arrayOf(PropTypes.string),
};

export default DetailViewModal;
