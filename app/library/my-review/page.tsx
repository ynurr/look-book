'use client'

import { useSession } from "next-auth/react";
import LeftMenu from "../LeftMenu";
import styles from './myReview.module.css'
import { PiStarFill } from "react-icons/pi";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { LuThumbsUp } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchReviewAll } from "@/store/slices/reviewSlice";
import Pagination from "@/app/components/Pagination";
import Image from "next/image";

export default function Review() {

    const { data: session, status } = useSession();

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const dispatch = useDispatch<AppDispatch>();
    const reviews = useSelector((state: RootState) => state.review.reviews || []);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchReviewAll({ user_id: session.user.sub, limit: 0 }))
        }
    }, [session, dispatch])

    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 4;
    const pageCount = Math.ceil(reviews.length / ItemsPerPage);
    const currentItems = reviews.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>나의 리뷰</h2>
                <div className={styles.line}></div>

                {reviews.length === 0 ?
                    <div className={styles.noData}>
                        <p>작성된 리뷰가 없습니다.</p>
                    </div>
                    :
                    currentItems.map((item, i) => (
                        <div className={styles.list} key={i}>
                            <Link href={`/library/reading/detail?isbn=${item.isbn}`}>
                                <div className={styles.bookInfo}>
                                    <Image
                                        className={styles.cover}
                                        src={item.cover}
                                        alt={item.title}
                                        width={60}
                                        height={80}
                                    />
                                    <div className={styles.bookDetail}>
                                        <p className={styles.title}>{item.title}</p>
                                        <p className={styles.date}>{item.created_at}</p>
                                        <div className={styles.rating}>
                                            {[...Array(5)].map((_, index) => (
                                                <PiStarFill 
                                                    key={index}
                                                    className={index < item.rating ? styles.starFill : styles.star}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.reviewBox}>
                                    <p className={styles.review}>{item.content}</p>
                                </div>
                                <div className={styles.reactionBox}>
                                    <span className={styles.likeCnt}><LuThumbsUp />{item.like_count}</span>
                                    <span className={styles.commentCnt}><FaRegCommentDots />{item.comment_count}</span>
                                </div>
                            </Link>
                            <div className={styles.hrLine}></div>
                        </div>
                    ))
                }
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}