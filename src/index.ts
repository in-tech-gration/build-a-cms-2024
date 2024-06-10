// function NAME() :<TypeScript type for return> {
function test(): void {
  console.log(process.env.DB);
  console.log(process.env.PORT);
  console.log("Server started running!");
}
test();