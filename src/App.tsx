import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import FileBrowser from './components/FileBrowser';
import FileViewer from './components/FileViewer';
import AdminPanel from './components/AdminPanel';
import StatusPage from './components/StatusPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<FileBrowser />} />
              <Route path="/browse/*" element={<FileBrowser />} />
              <Route path="/view/*" element={<FileViewer />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/status" element={<StatusPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
