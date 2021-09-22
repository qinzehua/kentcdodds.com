import * as React from 'react'
import {json, Link, LoaderFunction, useLoaderData} from 'remix'
import {ButtonLink} from '~/components/button'
import {Grid} from '~/components/grid'
import {MailIcon} from '~/components/icons/mail-icon'
import {BlogSection} from '~/components/sections/blog-section'
import {HeroSection} from '~/components/sections/hero-section'
import {H2, H3, H6, Paragraph} from '~/components/typography'
import {ConvertKitForm} from '~/convertkit/form'
import {getImgProps, images} from '~/images'
import type {Await} from '~/types'
import {getBlogRecommendations} from '~/utils/blog.server'
import {useRootData} from '~/utils/use-root-data'

type LoaderData = {
  blogRecommendations: Await<ReturnType<typeof getBlogRecommendations>>
}

export const loader: LoaderFunction = async ({request}) => {
  const blogRecommendations = await getBlogRecommendations(request)
  const data: LoaderData = {blogRecommendations}

  return json(data, {
    headers: {
      'Cache-Control': 'private, max-age=3600',
      Vary: 'Cookie',
    },
  })
}

export default function SubscribeScreen() {
  const data = useLoaderData<LoaderData>()
  const {userInfo} = useRootData()
  const subscribedToNewsletter = userInfo?.convertKit?.tags.some(
    ({name}) => name === 'Subscribed: general newsletter',
  )
  return (
    <>
      <HeroSection
        title="Increase your knowledge"
        subtitle="With valuable insights emailed to you each week"
        imageBuilder={images.snowboard}
        arrowUrl="#why"
        arrowLabel="Why should I?"
        action={
          <ButtonLink variant="primary" to="#subscribe-form">
            <MailIcon /> Subscribe
          </ButtonLink>
        }
      />
      <main>
        <Grid className="mb-24 lg:mb-64">
          <div className="col-span-full lg:col-span-6 lg:col-start-1">
            <div className="aspect-h-3 aspect-w-4 mb-12 lg:mb-0">
              <img
                className="rounded-lg object-cover"
                {...getImgProps(images.kentCodingWithSkates, {
                  widths: [410, 650, 820, 1230, 1640, 2460],
                  sizes: [
                    '(max-width: 1023px) 80vw',
                    '(min-width:1024px) and (max-width:1620px) 40vw',
                    '630px',
                  ],
                  transformations: {
                    resize: {
                      type: 'fill',
                      aspectRatio: '3:4',
                    },
                  },
                })}
              />
            </div>
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <H2 id="why" className="mb-10">
              {`Here's what you get out of subscribing.`}
            </H2>

            <ButtonLink
              className="mb-32"
              variant="primary"
              to="#subscribe-form"
            >
              <MailIcon /> Subscribe
            </ButtonLink>

            <H6 as="h3" className="mb-4">
              {`Stay sharp`}
            </H6>
            <Paragraph className="mb-12">
              {`
                Keeping yourself up-to-date is critical in this ever-changing
                fast-paced industry. One of the things that has helped me to
                keep myself sharp the most is to
              `}
              <strong>systemize regular exposure to ideas.</strong>
              {`
                When you give me your email, you're signing up to receive
                this kind of exposure every week. You'll read about the problems
                and solutions that I've experienced so you know what to reach
                for when you face similar problems in the future.
              `}
            </Paragraph>
            <H6 as="h3" className="mb-4">
              {`Stay updated`}
            </H6>
            <Paragraph className="mb-12">
              {`
                When you sign up for the newsletter, you'll also receive
                valuable notifications for when I create new opportunities to
                improve yourself. When I launch a new season of
              `}
              <Link to="/chats">Chats with Kent</Link>
              {`,
                give a discount on my courses, or have any number of other
                exciting announcements, you'll be the first to know.
              `}
            </Paragraph>
            <H6 as="h3" className="mb-4">
              {`Reply`}
            </H6>
            <Paragraph className="mb-12">
              {`
                Yes, I do get the emails you send me in return and I do try to
                read and reply to them all. In fact, the ideas and questions you
                have while reading the content you get delivered to your inbox
                may be well suited for
              `}
              <Link to="/calls">The Call Kent Podcast</Link>
              {` or `}
              <Link to="/office-hours">Office Hours</Link>
              {` so be sure to take advantage of those opportunities as well.`}
            </Paragraph>
          </div>

          {subscribedToNewsletter ? (
            <div className="col-span-full" id="subscribe-form">
              <H3>{`Hey, you're already subscribed`}</H3>
              <Paragraph>{`Good job! There's nothing for you to do here`}</Paragraph>
            </div>
          ) : (
            <>
              <div className="col-span-full lg:col-span-5">
                <H3>{`Sign up here`}</H3>
                <Paragraph>{`And get your first email this week!`}</Paragraph>
              </div>
              <div id="subscribe-form" className="col-span-full lg:col-span-7">
                <ConvertKitForm formId="newsletter" convertKitFormId="827139" />
              </div>
            </>
          )}
        </Grid>
        <BlogSection
          articles={data.blogRecommendations}
          title="Want a taste of what to expect?"
          description="Checkout these articles."
        />
      </main>
    </>
  )
}