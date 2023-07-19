import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SessionProvider from './contexts/Session'
import { adminRoutes, userRoutes, routes } from './routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'
import ScrollToTop from './routes/ScrollToTop'
import NotFound from './pages/NotFound'
import { AdminRoutes, UserRoutes } from 'routes/ProtectedRoutes'
import { Wrapper as MapWrapper } from '@googlemaps/react-wrapper'
import FavoritesProvider from 'contexts/Favorites'
import ShareProvider from 'contexts/Share'
import { HelmetProvider } from 'react-helmet-async'

function App() {
	return (
		<SessionProvider>
			<FavoritesProvider>
				<HelmetProvider>
					<ShareProvider>
						<QueryClientProvider client={queryClient}>
							<BrowserRouter>
								<MapWrapper apiKey={import.meta.env.VITE_GOOGLE_API_KEY} libraries={['places']}>
									<ScrollToTop />
									<Routes>
										{routes.map(({ path, Component }, i) => (
											<Route key={i} path={path} element={<Component />} />
										))}
										<Route element={<UserRoutes />}>
											{userRoutes.map(({ path, Component }, i) => (
												<Route key={i} path={path} element={<Component />} />
											))}
										</Route>
										<Route element={<AdminRoutes />}>
											{adminRoutes.map(({ path, Component }, i) => (
												<Route key={i} path={path} element={<Component />} />
											))}
										</Route>
										<Route path="*" element={<NotFound />} />
									</Routes>
								</MapWrapper>
							</BrowserRouter>
						</QueryClientProvider>
					</ShareProvider>
				</HelmetProvider>
			</FavoritesProvider>
		</SessionProvider>
	)
}

export default App
