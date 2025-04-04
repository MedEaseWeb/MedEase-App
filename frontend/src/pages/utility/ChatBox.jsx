// import React, { useState, useEffect } from "react";
// import { Box, TextField, Button, IconButton } from "@mui/material";
// import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
// import { io } from "socket.io-client";
// import Draggable from "react-draggable";

// // Connect to FastAPI backend
// // const socket = io("http://localhost:8081");
// // const socket = io("http://localhost:8081", {
// //   path: "/ws/socket.io",
// // });

// const Chatbox = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [expanded, setExpanded] = useState(true);

//   // // Socket event handlers
//   // useEffect(() => {
//   //   socket.on("connect", () => {
//   //     console.log("Connected to backend via Socket.IO");
//   //   });

//   //   socket.on("disconnect", () => {
//   //     console.log("Disconnected from backend");
//   //   });

//   //   socket.on("bot-message", (message) => {
//   //     console.log("🤖 GPT says:", message);
//   //     setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
//   //   });

//   //   return () => {
//   //     socket.off("connect");
//   //     socket.off("disconnect");
//   //     socket.off("bot-message");
//   //   };
//   // }, []);

//   // const sendMessage = () => {
//   //   if (input.trim() === "") return;
//   //   setMessages((prev) => [...prev, { text: input, sender: "user" }]);
//   //   socket.emit("user-message", input); // Matches backend event
//   //   setInput("");
//   // };

//   const toggleExpanded = () => setExpanded(!expanded);

//   return (
//     // <Draggable handle=".chatbox-header" defaultPosition={{ x: 100, y: 100 }}>
//       <div style={{ zIndex: 9999, position: "absolute" }}>
//         <Box
//           sx={{
//             width: expanded ? "500px" : "280px",
//             height: expanded ? "600px" : "60px",
//             display: "flex",
//             flexDirection: "column",
//             borderRadius: "20px",
//             boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
//             backgroundColor: "#ffffff",
//             border: "2px solid #027555",
//             overflow: "hidden",
//             fontFamily: "system-ui, sans-serif",
//             transition: "width 0.3s, height 0.3s",
//           }}
//         >
//           {/* Header */}
//           <Box
//             className="chatbox-header"
//             sx={{
//               backgroundColor: "#027555",
//               color: "white",
//               padding: "16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               fontSize: "18px",
//               fontWeight: "600",
//               cursor: "pointer",
//             }}
//             onClick={toggleExpanded}
//           >
//             Caregiver AI Assistant
//             <IconButton
//               size="small"
//               sx={{ color: "white" }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleExpanded();
//               }}
//             >
//               {expanded ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
//             </IconButton>
//           </Box>

//           {expanded && (
//             <>
//               {/* Message list */}
//               <Box
//                 sx={{
//                   flex: 1,
//                   padding: "12px",
//                   overflowY: "auto",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "8px",
//                   backgroundColor: "#f8f9fa",
//                 }}
//               >
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     sx={{
//                       padding: "10px 14px",
//                       borderRadius: "18px",
//                       maxWidth: "75%",
//                       alignSelf:
//                         msg.sender === "user" ? "flex-end" : "flex-start",
//                       backgroundColor:
//                         msg.sender === "user" ? "#D1E7DD" : "#E2E3E5",
//                       color: "#212529",
//                       fontSize: "15px",
//                       lineHeight: "1.4",
//                     }}
//                   >
//                     {msg.text}
//                   </Box>
//                 ))}
//               </Box>

//               {/* Input box */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "12px",
//                   borderTop: "1px solid #dee2e6",
//                   backgroundColor: "#ffffff",
//                 }}
//               >
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Type a message..."
//                   size="small"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") sendMessage();
//                   }}
//                   sx={{
//                     backgroundColor: "#fff",
//                     borderRadius: "10px",
//                     "& .MuiOutlinedInput-root": {
//                       "& fieldset": { borderColor: "#ced4da" },
//                       "&:hover fieldset": { borderColor: "#198754" },
//                       "&.Mui-focused fieldset": { borderColor: "#198754" },
//                     },
//                   }}
//                 />
//                 <Button
//                   onClick={sendMessage}
//                   sx={{
//                     marginLeft: "10px",
//                     backgroundColor: "#027555",
//                     color: "white",
//                     borderRadius: "10px",
//                     padding: "6px 16px",
//                     textTransform: "none",
//                     fontWeight: 500,
//                     "&:hover": {
//                       backgroundColor: "#00684A",
//                     },
//                   }}
//                 >
//                   Send
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Box>
//       </div>
//     // </Draggable>
//   );
// };

// export default Chatbox;
