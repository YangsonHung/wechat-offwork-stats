import { NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SubmitPage } from "./pages/SubmitPage";

export default function App() {
  return (
    <div className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">MVP</p>
          <h1>微信群程序员下班时间统计</h1>
          <p className="hero-copy">
            用半匿名打卡的方式，观察技术群整体的收工节奏。凌晨 5 点前的记录会自动计入前一天。
          </p>
        </div>
        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            今日统计
          </NavLink>
          <NavLink
            to="/submit"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            提交打卡
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
      </main>
    </div>
  );
}
