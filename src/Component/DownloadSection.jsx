import docu from "./Documents/Emmanuel Chidiebube Uzor.pdf";
import docu2 from "./Documents/Emmanuel Chidiebube Uzor Cover Letter.pdf";

const DownloadSection = () => {
  return (
    <div className="download-section">
      <div className="pdf-container">
        {/* Embedded PDF viewer */}
        <div className="pdf-viewer">
          <embed
            src={docu}
            type="application/pdf"
            width="100%"
            height="500px"
          />
        </div>

        <h4>Resume</h4>
        <a
          href={docu}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lux"
        >
          Open PDF in New Tab
        </a>
      </div>
      <div className="pdf-container">
        {/* Embedded PDF viewer */}
        <div className="pdf-viewer">
          <embed
            src={docu2}
            type="application/pdf"
            width="100%"
            height="500px"
          />
        </div>

        <h4>Cover Letter</h4>
        <a
          href={docu2}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lux"
        >
          Open PDF in New Tab
        </a>
      </div>
    </div>
  );
};

export default DownloadSection;
