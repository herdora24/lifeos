/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Esto apaga las advertencias de código durante el despliegue
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Esto ignora los errores de tipo estrictos
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
