 

File : Count.Java
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.util.*;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;
import java.util.StringTokenizer;
class Map extends Mapper<LongWritable, Text, Text, IntWritable> {
//Map Method
@Override
public void map(LongWritable Text, Text value, Context context) throws IOException, InterruptedException {
String line = value.toString();
StringTokenizer s = new StringTokenizer(line," ");
System.out.println("Mapper.. ");
while (s.hasMoreTokens()){
context.write(new Text(s.nextToken()), new IntWritable(1));
}
}
}
class Reduce extends  Reducer<Text, IntWritable, Text, IntWritable > {
//Reduce function
@Override
public void reduce(Text key, Iterable<IntWritable> values,Context context) throws IOException, InterruptedException {
int sum = 0;
System.out.println("Reducer.. ");
for(IntWritable val:values)
{
int t=val.get();
sum=sum+t;
System.out.println(key+" "+t);
}
context.write(key,new IntWritable(sum));
}
}
public class Count extends Configured implements Tool
{
@Override
public int run(String[] strings) throws Exception {
Job job=Job.getInstance(getConf());
job.setJobName("Word count");
job.setJarByClass(Count.class);
job.setOutputKeyClass(Text.class);
job.setOutputValueClass(IntWritable.class);
job.setReducerClass(Reduce.class);
job.setMapperClass(Map.class);
FileInputFormat.addInputPath(job, new Path("/Users/Param/Extra/data/input/count.txt"));
FileOutputFormat.setOutputPath(job, new Path("/Users/Param/Extra/data/output/"+new Date().getTime()));
return job.waitForCompletion(true)?1:0;
}
public static void main(String[] args) throws Exception {
ToolRunner.run(new Count(),args);
}
}
