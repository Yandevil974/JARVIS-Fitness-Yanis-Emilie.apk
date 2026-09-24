import java.io.*;
import java.nio.file.*;
import org.jf.dexlib2.*;
import org.jf.dexlib2.dexbacked.*;
import org.jf.baksmali.*;
import brut.androlib.src.SmaliBuilder;
import brut.directory.ExtFile;
public class DexBridge {
 public static void main(String[] args) throws Exception {
  if(args[0].equals("disassemble")) {
   DexBackedDexFile dex=new DexBackedDexFile(Opcodes.forApi(26),Files.readAllBytes(Paths.get(args[1])),0);
   BaksmaliOptions options=new BaksmaliOptions();options.apiLevel=26;
   if(!Baksmali.disassembleDexFile(dex,new File(args[2]),1,options))throw new IOException("Disassembly failed");
  } else if(args[0].equals("assemble")) SmaliBuilder.build(new ExtFile(new File(args[1])),new File(args[2]),26);
  else throw new IllegalArgumentException("Use assemble or disassemble");
 }
}
