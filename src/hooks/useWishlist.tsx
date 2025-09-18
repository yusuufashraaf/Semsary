import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@services/Wishlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

/**
 * useWishlist hook
 * - Tracks if a property is saved
 * - Handles optimistic UI updates
 * - Shows toast notifications only on user-triggered actions
 */
export function useWishlist(propertyId: number) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch wishlist once on mount to determine initial saved state
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        if (res.data?.some((w: any) => w.property.id === propertyId)) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlist();
  }, [propertyId]);

  // Toggle wishlist (user-triggered)
  const toggleWishlist = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      if (isSaved) {
        // Optimistic update
        setIsSaved(false);
        await removeFromWishlist(propertyId);
        toast.success("Removed from wishlist!", {
          icon: <FontAwesomeIcon icon={faHeartCrack} color="#c44040" />,
        });
      } else {
        setIsSaved(true);
        await addToWishlist(propertyId);
        toast.success("Added to wishlist!", {
          icon: <FontAwesomeIcon icon={faHeart} color="#c44040" />,
        });
      }
    } catch (err: any) {
      // rollback
      setIsSaved(!isSaved);

      // Unauthorized → redirect after toast
      if (err.response?.status === 401) {
        toast.warn("Please log in to add to wishlist", {
          onClose: () => navigate("/login"),
          autoClose: 1000,
        });
      } else {
        console.error("Wishlist error:", err);
        toast.error("An error occurred while updating wishlist.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, loading, toggleWishlist };
}
