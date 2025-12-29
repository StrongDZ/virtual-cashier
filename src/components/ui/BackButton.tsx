import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";

interface BackButtonProps {
    className?: string;
    to?: string;
}

const BackButton = ({ className, to }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={className}>
            <Button variant="primary" size="lg" onClick={handleBack} className="px-6 min-w-[90px] py-5">
                <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </span>
            </Button>
        </motion.div>
    );
};

export default BackButton;
