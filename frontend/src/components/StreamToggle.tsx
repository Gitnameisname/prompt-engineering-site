type Props = {
    value: boolean;
    onToggle: () => void;
  };
  
  export default function StreamToggle({ value, onToggle }: Props) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>스트리밍</span>
        <div
          onClick={onToggle}
          style={{
            width: "50px",
            height: "28px",
            borderRadius: "9999px",
            backgroundColor: value ? "#4CAF50" : "#ccc",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: value ? "26px" : "3px",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "white",
              transition: "left 0.3s",
            }}
          />
        </div>
      </div>
    );
  }
  