import { Link, type LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Định nghĩa các kiểu style
const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
};

// Định nghĩa các props cơ bản
interface BaseProps {
    children: ReactNode;
    className?: string;
    variant?: keyof typeof variants;
}

// Props cho thẻ <button>
type ButtonProps = BaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: "button";
    };

// Props cho thẻ <Link>
type LinkButtonProps = BaseProps &
    LinkProps & {
        as: "link";
    };

// Gộp 2 loại props
type Props = ButtonProps | LinkButtonProps;

export default function Button(props: Props) {
    // 1. Destructure props chung (dùng cho style)
    const { variant = "solid", className = "", children } = props;

    // 2. Tạo style
    const baseStyle =
        "font-semibold py-2 px-5 rounded-md transition duration-300 text-center inline-block";
    const variantStyle = variants[variant];
    const combinedClassName = `${baseStyle} ${variantStyle} ${className}`;

    // 3. Xử lý trường hợp là <Link>
    if (props.as === "link") {
        // SỬA LỖI:
        // Đổi tên các biến trùng lặp (vd: 'as' thành '_as')
        // để loại bỏ chúng khỏi ...restLinkProps
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
            as: _as,
            variant: _variant,
            className: _className,
            children: _children,
            ...restLinkProps
        } = props;

        return (
            <Link className={combinedClassName} {...restLinkProps}>
                {children}
            </Link>
        );
    }

    // 4. Mặc định là <button>
    // SỬA LỖI TƯƠNG TỰ:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
        as: _as,
        variant: _variant,
        className: _className,
        children: _children,
        ...restButtonProps
    } = props;

    return (
        <button className={combinedClassName} {...restButtonProps}>
            {children}
        </button>
    );
}
