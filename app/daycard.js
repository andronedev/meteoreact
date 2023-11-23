'use client'
import {useState} from 'react'

export default function DayCard(props) {
    const {
        day
    } = props

    return (
        <div className="w-3/6 h-80 flex flex-col items-center justify-between backdrop-blur-lg p-5 rounded-2xl bg-white bg-opacity-30 shadow-2xl hover:bg-white duration-150">
            <p className="text-xl font-medium mb-4">
                {
                day.date
            } </p>
            <img src={
                    day.day.condition.icon
                }
                alt="icon"
                width={100}
                height={100}/>
            <p className="text-3xl font-bold mb-4">
                {
                day.day.avgtemp_c
            }°C
            </p>
            <p className="text-xl font-medium mb-4 text-center h-12">
                {
                day.day.condition.text
            } </p>
        </div>
    )
}
