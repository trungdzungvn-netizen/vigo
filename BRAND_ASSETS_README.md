# ViGo Brand Assets

## Logo files
- `public/brand/vigo-logo.svg`: logo ngang chính, dùng trên header/website.
- `public/brand/vigo-symbol.svg`: biểu tượng độc lập.
- `public/brand/vigo-app-icon.svg`: icon vuông cho app/PWA.
- `public/brand/vigo-logo-white.svg`: bản logo trắng dùng trên nền xanh đậm.
- `public/brand/vigo-logo-mono.svg`: bản đơn sắc dùng cho in ấn.
- `public/favicon.svg`: favicon trình duyệt.
- `public/vigo-logo.svg`: bản logo tương thích với code hiện tại.
- `app-icon.svg`: bản sao icon ở thư mục gốc dự án để tiện tham khảo.

## Màu thương hiệu
- Xanh đậm: `#0B5E3B`
- Xanh lá: `#16A344`
- Xanh ngọc: `#34D399`
- Xanh mint nhạt: `#D1FAE5`
- Vàng nhấn: `#FBBF24`
- Đỏ san hô biểu tượng: `#EF4444`

## Sử dụng
Header và footer đang dùng `/vigo-logo.svg`; file này đã được thay bằng logo mới. Metadata Next.js dùng `/favicon.svg` và app icon. Các asset còn lại có thể dùng trực tiếp bằng đường dẫn `/brand/...`.

## Triển khai
Đưa các file mới trong `public/`, `app/layout.tsx`, và `BRAND_ASSETS_README.md` lên repository hiện tại. Không thay `.env.local` hoặc biến môi trường Supabase trên Vercel.
