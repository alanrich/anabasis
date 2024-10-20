import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Divider, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { shouldForwardProp } from "@mui/system";
import DOMPurify from "dompurify";
import { formatUrls } from "../../utils/formatUrls";
import { cleanHtmlContent } from "../../utils/cleanHtmlContent";
import StyledButton from "../StyledButton";

const FieldTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isModal" && shouldForwardProp(prop),
})(({ theme, isModal }) => ({
  display: "inline-block",
  backgroundColor: theme.palette.grey[400],
  color: "white",
  padding: "6px 12px",
  borderRadius: theme.shape.borderRadiusLarge,
  marginBottom: theme.spacing(1),
  fontSize: isModal
    ? theme.typography.subtitle1.fontSize
    : theme.typography.subtitle2.fontSize,
}));

const Field = ({ title, value, type, isModal, fontSize, isWikiContent }) => {
  const theme = useTheme();
  const isHistoire = title.toLowerCase().includes("histoire");

  const titleVariant = isModal ? "h6" : "subtitle1";
  const valueFontSize =
    fontSize || (isModal ? (isHistoire ? ".8rem" : "1rem") : ".8rem");

  if (!value) {
    value = "Non disponible";
  }

  const commonStyles = {
    border: `1px solid ${theme.palette.grey[300]}`,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    marginBottom: theme.spacing(2),
    width: "100%",
  };

  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const chunkSize = 5000; // Adjust as needed

  const handleToggleExpand = () => {
    const cleanHtml = cleanHtmlContent(value);
    const totalLength = cleanHtml.length;
    const nextIndex = Math.min(currentIndex + chunkSize, totalLength);

    setDisplayedContent(cleanHtml.slice(0, nextIndex));
    setCurrentIndex(nextIndex);
  };

  // Initialize displayed content
  React.useEffect(() => {
    if (isWikiContent) {
      handleToggleExpand();
    }
  }, [value]);

  // Handle URLs when type is 'URL'
  if (type === "URL") {
    const formattedUrls = formatUrls(value); // Use the helper function

    return (
      <Box sx={commonStyles}>
        {title && (
          <>
            <FieldTitle variant={titleVariant} isModal={isModal}>
              {title}:
            </FieldTitle>
            <Divider sx={{ marginBottom: theme.spacing(1) }} />
          </>
        )}
        {formattedUrls.map((url, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              marginLeft: theme.spacing(1),
              fontSize: valueFontSize,
              marginBottom: theme.spacing(1),
            }}
          >
            {url.toLowerCase() === "non disponible" ? (
              "Non disponible"
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            )}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={commonStyles}>
      {title && (
        <>
          <FieldTitle variant={titleVariant} isModal={isModal}>
            {title}:
          </FieldTitle>
          <Divider sx={{ marginBottom: theme.spacing(1) }} />
        </>
      )}
      {isWikiContent ? (
        <>
          <Typography
            variant="body1"
            sx={{
              marginLeft: theme.spacing(1),
              fontSize: valueFontSize,
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(displayedContent),
            }}
          />
          {currentIndex < cleanHtmlContent(value).length && (
            <StyledButton
              text={"Voir Plus"}
              handleAction={handleToggleExpand}
            />
          )}
        </>
      ) : typeof value === "string" ? (
        <Typography
          variant="body1"
          sx={{
            marginLeft: theme.spacing(1),
            fontSize: valueFontSize,
          }}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
};

Field.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  isModal: PropTypes.bool,
  fontSize: PropTypes.string,
  isWikiContent: PropTypes.bool,
};

Field.defaultProps = {
  type: "text",
  isModal: false,
  isWikiContent: false,
};

export default Field;
