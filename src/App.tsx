// src/app/App.tsx

import { AppRouter } from './app/Router';
import { EnhancedLoadingScreen } from './app/EnhancedLoadingScreen';

/**
 * @description Корневой компонент приложения.
 * Главная задача этого компонента — служить контейнером для глобальных про-
 * вайдеров (управление состоянием, темы, аутентификация и т.д.), 
 * которые должны быть доступны во всем приложении.
 * @returns {JSX.Element}
 */
function App() {
  // На данный момент здесь только роутер.
  // В будущем мы будем "оборачивать" AppRouter в другие компоненты-провайдеры.
  return (
    <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      <AppRouter />
    </>
  );
}

export default App;