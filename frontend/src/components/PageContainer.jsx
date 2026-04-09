function PageContainer({ children }) {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

export default PageContainer;