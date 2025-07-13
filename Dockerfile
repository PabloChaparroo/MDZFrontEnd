# Dockerfile para frontend Vite + React (TypeScript)
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json y package-lock.json primero para aprovechar el cache de dependencias
COPY package*.json ./

RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la app
RUN npm run build

# --- Servidor estático ---
FROM nginx:alpine AS production

# Copia el build de Vite al directorio público de nginx
COPY --from=build /app/dist /usr/share/nginx/html


# Copia configuración personalizada de nginx para SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
