'use client'

import { useSession } from "next-auth/react";
import LeftMenu from "../LeftMenu";
import styles from './myReview.module.css'
import { PiStarFill } from "react-icons/pi";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { LuThumbsUp } from "react-icons/lu";
import { RiThumbUpFill } from "react-icons/ri";
import { FaRegCommentDots } from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchReviewAll } from "@/store/slices/reviewSlice";
import Pagination from "@/app/(components)/Pagination";

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
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>나의 리뷰</h2>
                <div className={styles.line}></div>

                {reviews.length === 0 ?
                    <div className={styles.noData}>
                        <span>작성된 리뷰가 없습니다.</span>
                    </div>
                    :
                    currentItems.map((item, i) => (
                        <div className={styles.list} key={i}>
                            <Link href={`/library/reading/detail?isbn=${item.isbn}`}>
                                <div className={styles.bookInfo}>
                                    <img className={styles.cover} src={item.cover} alt={item.title}/>
                                    <div className={styles.bookDetail}>
                                        <span className={styles.title}>{item.title}</span>
                                        <span className={styles.date}>{item.created_at}</span>
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
                                    <span className={styles.review}>{item.content}</span>
                                </div>
                                <div className={styles.reactionBox}>
                                    <span className={styles.likeCnt}><LuThumbsUp />{item.like_count}</span>
                                    <span className={styles.commentCnt}><FaRegCommentDots /> 0</span>
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