import Link from "next/link";
import Image from "next/image";
import styles from "./Card.module.css";

type CardProps = {
  imageSrc: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  location: string;
  age: number;
  href?: string;
};

export default function Card({
  imageSrc,
  fullName,
  birthDate,
  deathDate,
  age,
  href,
}: CardProps) {
  const cardContent = (
    <>
      {/* Image */}
      <div className={styles.imageRow}>
        <div className={styles.imageFrame}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={fullName}
              fill
              sizes="160px"
              className={styles.image}
            />
          )}
        </div>
      </div>

      {/* Name */}
      <h2 className={styles.name}>
        {fullName}
      </h2>

      {/* Dates */}
      <p className={styles.dates}>
        {birthDate} {birthDate && deathDate ? "-" : ""} {deathDate}
      </p>

      {typeof age === "number" && age > 0 && (
        <p className={styles.age}>
          u {age} godini
        </p>
      )}

      <div className={styles.divider} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={styles.link}
      >
        <article className={styles.article}>
          {cardContent}
        </article>
      </Link>
    );
  }

  return (
    <article className={styles.article}>
      {cardContent}
    </article>
  );
}
