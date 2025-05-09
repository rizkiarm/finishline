import { render } from "preact";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

render(
    <ThemeProvider>
        <App />
    </ThemeProvider>,
    document.getElementById("app") as HTMLElement,
);
