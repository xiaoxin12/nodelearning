package main

import (
	"fmt"
	"os"
)

func main()  {
	fmt.Println("可配以")
	//var s,sep string
	//for i :=1; i < len(os.Args); i++{
	//	s += sep + os.Args[i]
	//	sep = " "
	//}
	// 第二版
	s, sep := "", ""
	fmt.Println(os.Args[0])
	for _,arg := range os.Args[1:]{
		fmt.Println("woshi")
		s += sep + arg
		sep = ""
	}
	fmt.Println(s)
}