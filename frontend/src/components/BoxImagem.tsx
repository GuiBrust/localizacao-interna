import { TransformWrapper, TransformComponent, KeepScale } from "react-zoom-pan-pinch";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function BoxImagem({ imageUrl, markers }) {
  return (
    imageUrl && (
      <TransformWrapper>
        <TransformComponent>
          <img src={imageUrl} />
          {markers.map((marker, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: `${marker.top}%`,
                left: `${marker.left}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <KeepScale>
                <FaMapMarkerAlt fill="red" style={{ width: "20px", height: "20px" }} />
              </KeepScale>
            </div>
          ))}
        </TransformComponent>
      </TransformWrapper>
    )
  );
}
