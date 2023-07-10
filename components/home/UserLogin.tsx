'use client'

import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
export const UserLogin = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">

    <Card className="w-[450px] h-[450px] flex flex-col items-center justify-center shadow-2xl bg-orange-500">
      <CardHeader>
        <CardTitle className="text-center text-white">Ingresá tu codigo de descarga</CardTitle>
        <CardDescription className="text-center text-white px-12">Buscá el codigo en tu tarjeta digital e ingresalo aquí o escanea el codigo QR de la misma.</CardDescription>
      </CardHeader>
      <CardContent className="w-full px-14">
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="name" placeholder="Ingresa el codigo aqui" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <Button className="border border-white text-white" variant={'ghost'}>Ingresar</Button>
      </CardFooter>
    </Card>
    </div>
  )
}