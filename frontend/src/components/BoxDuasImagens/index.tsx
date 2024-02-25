import { TransformWrapper, TransformComponent, KeepScale } from "react-zoom-pan-pinch";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import styles from "./styles.module.scss";

export default function BoxDuasImagens({ imageUrl, markers, imageUrl2, markers2 }) {
  const style_icon = {
    width: "20px",
    height: "20px",
  };

  const renderMarkers = (imageSrc, markers, origem) => (
    <>
      <img src={imageSrc} />
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
            {origem ? <FaMapPin fill="blue" style={style_icon} /> : <FaMapMarkerAlt fill="red" style={style_icon} />}
          </KeepScale>
        </div>
      ))}
    </>
  );

  return (
    <>
      {imageUrl && (
        <Box className={styles.boxInterna}>
          <span>Localização Atual</span>
          <TransformWrapper>
            <TransformComponent>{renderMarkers(imageUrl, markers, true)}</TransformComponent>
          </TransformWrapper>
        </Box>
      )}

      {imageUrl2 && (
        <Box className={styles.boxInterna}>
          <span>Destino Desejado</span>
          <TransformWrapper>
            <TransformComponent>{renderMarkers(imageUrl2, markers2, false)}</TransformComponent>
          </TransformWrapper>
        </Box>
      )}
    </>
  );
}
