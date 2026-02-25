/**
 * GROQ queries for fetching content from Sanity.
 */

import { groq } from 'next-sanity'

export const siteByHostnameQuery = groq`
  *[_type == "site" && hostname == $hostname][0] {
    _id,
    name,
    hostname,
    logo,
    primaryColor,
    secondaryColor,
    defaultLocale,
    navigation[] {
      label,
      href,
      children[] {
        label,
        href
      }
    },
    footerLinks[] {
      label,
      href
    }
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && site._ref == $siteId && slug.current == $slug][0] {
    _id,
    title,
    slug,
    seo {
      title,
      description,
      image
    },
    blocks[] {
      _type,
      _key,
      ...,
      _type == "heroBlock" => {
        heading,
        subheading,
        ctaText,
        ctaLink,
        backgroundImage
      },
      _type == "textImageBlock" => {
        heading,
        text,
        image,
        imagePosition,
        ctaText,
        ctaLink
      },
      _type == "ctaSection" => {
        heading,
        text,
        ctaText,
        ctaLink
      },
      _type == "faqBlock" => {
        heading,
        items[] {
          question,
          answer
        }
      }
    }
  }
`

export const blogPostsQuery = groq`
  *[_type == "blogPost" && site._ref == $siteId && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    author-> {
      name,
      image
    },
    publishedAt,
    categories[]
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && site._ref == $siteId && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    coverImage,
    author-> {
      name,
      image,
      bio
    },
    publishedAt,
    categories[],
    seo {
      title,
      description,
      image
    }
  }
`

export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && site._ref == $siteId && slug.current == $slug][0] {
    _id,
    title,
    slug,
    metaDescription,
    content,
    lastUpdated
  }
`
