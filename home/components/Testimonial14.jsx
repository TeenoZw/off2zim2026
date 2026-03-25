"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  VideoIframe,
} from "@relume_io/relume-ui";
import React from "react";
import { BiSolidStar } from "react-icons/bi";
import { FaCirclePlay } from "react-icons/fa6";

export function Testimonial14() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid items-center justify-center w-full grid-cols-1 gap-12 auto-cols-fr md:grid-cols-2 md:gap-10 lg:gap-x-20">
          <div className="order-last md:order-first">
            <Dialog>
              <DialogTrigger className="relative flex items-center justify-center w-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                  alt="Relume placeholder image"
                  className="object-cover size-full"
                />
                <span className="absolute inset-0 z-10 bg-black/50" />
                <FaCirclePlay className="absolute z-20 text-white size-16" />
              </DialogTrigger>
              <DialogContent>
                <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex mb-6 md:mb-8">
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
            </div>
            <blockquote className="text-xl font-bold md:text-2xl">
              "Off2Zim made my trip unforgettable! The ease of booking
              activities and accommodations was incredible."
            </blockquote>
            <div className="flex items-center gap-5 mt-6 flex-nowrap md:mt-8">
              <div>
                <p className="font-semibold">Jane Doe</p>
                <p>Traveler, USA</p>
              </div>
              <div className="self-stretch w-px mx-4 bg-background-alternative sm:mx-0" />
              <div>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                  alt="Webflow logo 1"
                  className="max-h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
