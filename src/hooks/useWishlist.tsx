import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist, getWishlist } from "@services/Wishlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useSelector } from "react-redux"; // Use Redux to get user authentication
import { RootState } from "@store/index"; // Adjust based on your store structure

export function useWishlist(propertyId: number) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user authentication state from Redux
  const user = useSelector((state: RootState) => state.Authslice.user);

  // Check if the user is logged in (from Redux store)
  const isAuthenticated = !!user; // User should be an object when logged in, otherwise null/undefined

  // Fetch wishlist once on mount to determine initial saved state
  useEffect(() => {
    if (!isAuthenticated) return; // Skip fetch if not authenticated

    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        if (res.data?.some((w: any) => w.property.id === propertyId)) {
          setIsSaved(true);
        }
      } catch (err: unknown) {
        const axiosError = err as AxiosError; // Type assertion
        if (axiosError.response?.status === 401) {
          toast.warn("Please log in to view your wishlist", {
            onClose: () => navigate("/login"),
            autoClose: 1000,
          });
        } else {
          toast.error("Failed to fetch wishlist");
        }
      }
    };

    fetchWishlist();
  }, [propertyId, isAuthenticated, navigate]);

  // Toggle wishlist (user-triggered)
  const toggleWishlist = async () => {
    if (loading) return;
    if (!isAuthenticated) {
      toast.warn("Please log in to add to wishlist", {
        onClose: () => navigate("/login"),
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        // Optimistic update (remove from wishlist)
        setIsSaved(false);
        await removeFromWishlist(propertyId);
        toast.success("Removed from wishlist!", {
          icon: <FontAwesomeIcon icon={faHeartCrack} color="#c44040" />,
        });
      } else {
        // Optimistic update (add to wishlist)
        setIsSaved(true);
        await addToWishlist(propertyId);
        toast.success("Added to wishlist!", {
          icon: <FontAwesomeIcon icon={faHeart} color="#c44040" />,
        });
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError; // Type assertion

      // Rollback in case of error
      setIsSaved(!isSaved);

      if (axiosError.response?.status === 401) {
        toast.warn("Please log in to add to wishlist", {
          onClose: () => navigate("/login"),
          autoClose: 1000,
        });
      } else {
        toast.error("An error occurred while updating wishlist.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, loading, toggleWishlist };
}
