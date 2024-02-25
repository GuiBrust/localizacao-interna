import { TransformWrapper, TransformComponent, KeepScale } from "react-zoom-pan-pinch";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";

export default function BoxImagem({ imageUrl, markers }) {
  const style_icon = {
    width: "20px",
    height: "20px",
  };
    
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
                {index === 0 ? (
                  <FaMapPin fill="blue" style={style_icon} />
                ) : (
                  <FaMapMarkerAlt fill="red" style={style_icon} />
                )}
              </KeepScale>
            </div>
          ))}
        </TransformComponent>
      </TransformWrapper>
    )
  );
}
